import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-8">
          <div className="text-center max-w-sm">
            <div className="font-serif text-5xl text-accent">—</div>
            <div className="font-sans text-[11px] tracking-[0.22em] uppercase text-ink-mid mt-6 font-medium">
              algo salió mal
            </div>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-6 font-sans text-[10px] tracking-[0.14em] uppercase font-medium text-ink bg-transparent border border-line rounded-[10px] py-3 px-6 cursor-pointer"
            >
              intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
