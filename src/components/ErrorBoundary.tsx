"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: "8px",
            margin: "1rem",
          }}
        >
          <h2 style={{ color: "#d32f2f", margin: "0 0 1rem 0" }}>
            ⚠️ エラーが発生しました
          </h2>
          <p style={{ color: "#666", margin: "0 0 1rem 0" }}>
            アプリケーションでエラーが発生しました。ページを再読み込みしてお試しください。
          </p>
          <details style={{ textAlign: "left", marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              エラー詳細
            </summary>
            <pre style={{ 
              background: "#f5f5f5", 
              padding: "1rem", 
              borderRadius: "4px",
              fontSize: "0.875rem",
              overflow: "auto"
            }}>
              {this.state.error?.message}
              {"\n"}
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            🔄 ページを再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}