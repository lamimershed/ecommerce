"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  color?: string;
}

/**
 * Catches any error from the WebGL canvas (lost context, asset failure, no GPU)
 * and renders a calm static gradient instead of crashing the page.
 */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      const color = this.props.color ?? "#888";
      return (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            backgroundImage: `radial-gradient(60% 60% at 50% 40%, ${color}33, transparent), linear-gradient(160deg, hsl(var(--card)), hsl(var(--secondary)))`,
          }}
        >
          <div
            className="h-28 w-28 rounded-full blur-xl"
            style={{ background: color, opacity: 0.5 }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
