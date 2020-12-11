import React from "react";
import { v4 } from "uuid";
import { ShareableViewData } from "../WorkerApp";
import { AppTransport } from "../types";
import { createTransport } from "../Transport";
import { AnyComponent } from "./UIComponent";
import RootReactMultiThreadedComponent from "./RootComponent";
interface ClientState {
  runningViews: ShareableViewData[];
}

const stringifyWithoutCircular = (json: any) => {
  // to avoid crash while using circular props
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (_key: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  return JSON.stringify(json, getCircularReplacer());
};
class Client extends React.Component<
  {
    transport?: AppTransport;
    UIComponents: AnyComponent<any>[];
  },
  ClientState
> {
  state: ClientState = {
    runningViews: [],
  };
  private transport = this.props.transport || createTransport();
  private get UIComponents() {
    return [...this.props.UIComponents, RootReactMultiThreadedComponent];
  }
  componentDidMount() {
    this.transport.on(
      "update_views_tree",
      ({ views }: { views: ShareableViewData[] }) => {
        this.setState({ runningViews: views });
      }
    );
    this.transport.on(
      "update_view",
      ({ view }: { view: ShareableViewData }) => {
        this.setState((state) => {
          const runningViewIndex = state.runningViews.findIndex(
            (currentView) => currentView.uid === view.uid
          );
          if (runningViewIndex !== -1) {
            state.runningViews[runningViewIndex] = view;
          } else {
            state.runningViews.push(view);
          }
          return { runningViews: [...state.runningViews] };
        });
      }
    );
    this.transport.on("delete_view", ({ viewUid }: { viewUid: string }) => {
      this.setState((state) => {
        const runningViewIndex = state.runningViews.findIndex(
          (view) => view.uid === viewUid
        );
        if (runningViewIndex !== -1) {
          state.runningViews.splice(runningViewIndex, 1);
          return { runningViews: [...state.runningViews] };
        }
      });
    });
    this.transport.on("on_worker_start", () => {
      this.transport.emit("request_views_tree");
    });
  }
  renderView(view: ShareableViewData): JSX.Element {
    const componentToRender = this.UIComponents.find(
      (component) => component.name === view.name
    );
    if (componentToRender) {
      const props: any = { key: view.uid };
      view.props.forEach((prop) => {
        if (prop.type === "data") {
          props[prop.name] = prop.data;
        } else if (prop.type === "event")
          [
            (props[prop.name] = (...args: any) => {
              return new Promise((resolve) => {
                const requestUid = v4();
                this.transport.on(
                  "respond_to_event",
                  ({
                    data,
                    uid,
                    eventUid,
                  }: {
                    data: any;
                    uid: string;
                    eventUid: string;
                  }) => {
                    if (uid === requestUid && eventUid === prop.uid) {
                      resolve(data);
                    }
                  }
                );
                this.transport.emit("request_event", {
                  eventArguments: JSON.parse(stringifyWithoutCircular(args)),
                  eventUid: prop.uid,
                  uid: requestUid,
                });
              });
            }),
          ];
      });
      const children = this.state.runningViews
        .filter((runningView) => runningView.parentUid === view.uid)
        .sort((a, b) => a.childIndex - b.childIndex)
        .map((runningView) => this.renderView(runningView));
      return React.createElement(componentToRender, {
        ...props,
        children: children.length > 0 ? children : undefined,
      });
    }
    throw new Error(
      `missing componnent ${view.name} please pass it to the views array`
    );
  }
  render() {
    const root = this.state.runningViews.find((view) => view.isRoot);
    if (!root) {
      return <></>;
    }
    return this.renderView(root);
  }
}

export default Client;
