import React from "react";
import { v4 } from "uuid";
import { AppTypeContext, WorkerAppContext } from "../Contexts";
import type { App as WorkerApp } from "../WorkerApp";
import { createFunction } from '../utils/createFunction'

const ViewParentContext = React.createContext<
  { uid: string; childIndex: number } | undefined
>(undefined);

type MapResultToPromise<T> = T extends (...args: infer U) => infer R
  ? R extends Promise<any>
    ? (...args: U) => R
    : (...args: U) => Promise<R>
  : T;

type ParseProps<Props extends Record<string, any>> = {
  [Key in keyof Props]: MapResultToPromise<Props[Key]>;
};

type UnParseProps<Props extends ParseProps<any>> = Props extends ParseProps<
  infer OriginalProps
>
  ? OriginalProps
  : never;

type UIComponentProps<Props extends Record<string, any>> = ParseProps<
  React.PropsWithChildren<Props>
>;

type FunctionComponent<P> = (props: P) => React.ReactElement;

type ClassComponent<P> = new (props: P) => React.Component<P, any>;

type AnyComponent<P> = FunctionComponent<P> | ClassComponent<P>;

type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends AnyComponent<infer TProps>
    ? TProps
    : TComponentOrTProps

const AsUIComponent = <
  Component extends FunctionComponent<any> | ClassComponent<any>
>(
  component: Component
) => {
  return createFunction(component.name, (props: UnParseProps<ExtractProps<Component>>) => {
    return (
      <UIComponentContainer<ExtractProps<Component>, Component>
        component={component}
        props={props as ExtractProps<Component>}
      />
    );
  });
};

interface UIComponentContainerProps<C, P> {
  component: C;
  props: P;
}

abstract class UIComponentContainer<
  Props extends Record<string, any>,
  Component extends FunctionComponent<Props> | ClassComponent<Props>
> extends React.Component<UIComponentContainerProps<Component, Props>> {
  static contextType = AppTypeContext;
  declare context: React.ContextType<typeof AppTypeContext>;
  private uid = v4();
  private mountState: "premounted" | "mounted" | "unmounted" = "premounted";
  private workerApp?: WorkerApp;
  componentDidMount = () => {
    if (this.context === "worker") {
      this.mountState = "mounted";
      this.forceUpdate();
    }
  };
  componentWillUnmount = () => {
    if (this.context === "worker") {
      this.mountState = "unmounted";
      if (this.workerApp) {
        this.workerApp.deleteRunningView(this.uid);
      }
    }
  };
  private workerRender = () => {
    return (
      <WorkerAppContext.Consumer>
        {(app) => {
          if (!app || this.mountState !== "mounted") {
            return <> </>;
          }
          this.workerApp = app;
          return (
            <ViewParentContext.Consumer>
              {(parent) => {
                app.updateRunningView({
                  parentUid: parent?.uid || "",
                  isRoot: parent === undefined,
                  childIndex: parent?.childIndex || 0,
                  name: this.props.component.name,
                  props: this.props.props,
                  uid: this.uid,
                });
                if (Array.isArray(this.props.children)) {
                  return (this.props.props.children as JSX.Element[]).map(
                    (child, index) => (
                      <ViewParentContext.Provider
                        key={index}
                        value={{ uid: this.uid, childIndex: index }}
                      >
                        {child}
                      </ViewParentContext.Provider>
                    )
                  );
                } else {
                  return (
                    <ViewParentContext.Provider
                      value={{ uid: this.uid, childIndex: 0 }}
                    >
                      {this.props.props.children}
                    </ViewParentContext.Provider>
                  );
                }
              }}
            </ViewParentContext.Consumer>
          );
        }}
      </WorkerAppContext.Consumer>
    );
  };
  render() {
    if (this.context === "worker") {
      return this.workerRender();
    } else {
      const Component = this.props.component;
      return React.createElement(Component, this.props.props);
    }
  }
}

export { AsUIComponent, UIComponentProps, AnyComponent };
