import React from "react";
import { v4 } from "uuid";
import { AppTypeContext, WorkerAppContext } from "../Contexts";
import type { App as WorkerApp } from "../WorkerApp";

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

abstract class UIComponent<
  Props extends object = {},
  State = {}
> extends React.Component<ParseProps<Props>, State> {
  static contextType = AppTypeContext;
  declare context: React.ContextType<typeof AppTypeContext>;
  private uid = v4();
  private mountState: "premounted" | "mounted" | "unmounted" = "premounted";
  private workerApp?: WorkerApp;
  constructor(props: ParseProps<Props>) {
    super(props);
    const renderUI = this.render;
    const componentDidMountUI = this.componentDidMount;
    const componentWillUnmountUI = this.componentWillUnmount;
    this.componentDidMount = () => {
      if (this.context === "worker") {
        this.mountState = "mounted";
        this.forceUpdate();
      } else {
        if (componentDidMountUI) {
          componentDidMountUI.bind(this)();
        }
      }
    };
    this.componentWillUnmount = () => {
      if (this.context === "worker") {
        this.mountState = "unmounted";
        if (this.workerApp) {
          this.workerApp.deleteRunningView(this.uid);
        }
      } else {
        if (componentWillUnmountUI) {
          componentWillUnmountUI.bind(this)();
        }
      }
    };
    this.render = () => {
      if (this.context === "worker") {
        return this.workerRender();
      }
      return renderUI.bind(this)();
    };
  }
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
                  name: this.constructor.name,
                  props: this.props,
                  uid: this.uid,
                });
                if (Array.isArray(this.props.children)) {
                  return (this.props.children as JSX.Element[]).map(
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
                      {this.props.children}
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
}

type UIComponentClass<C> = C;

const AsUIComponent = <
  Props extends ParseProps<any>,
  Component extends UIComponent,
  ResultComponent extends new (props: UnParseProps<Props>) => React.Component<
    UnParseProps<Props>
  >
>(
  component: new (props: Props) => Component
): ResultComponent => {
  return (component as unknown) as UIComponentClass<ResultComponent>;
};

export default UIComponent;

export { AsUIComponent, UIComponentClass };
