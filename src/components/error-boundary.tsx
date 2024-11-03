import { Component, ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		console.log(error);
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.log(error, errorInfo);
	}

	render(): React.ReactNode {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-100">
					<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							Oops! Something went wrong.
						</h2>
						<p className="text-gray-600 mb-4">
							We're sorry, but an error occurred while rendering this page.
						</p>
						<p className="text-sm text-gray-500 mb-4">
							Error: {this.state.hasError.valueOf()}
						</p>
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							onClick={() => window.location.reload()}
						>
							Reload Page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
