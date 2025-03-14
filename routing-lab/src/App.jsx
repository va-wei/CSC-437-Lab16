import { Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import { useState } from "react";
import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { useImageFetching } from "./images/useImageFetching.js";
import { RegisterPage } from "../../labs-server/src/auth/RegisterPage.jsx";
import { LoginPage } from "../../labs-server/src/auth/LoginPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

function App() {
	const [userName, setUserName] = useState("John Doe");
	const [authToken, setAuthToken] = useState(null);
	const { isLoading, fetchedImages } = useImageFetching("", authToken);

	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route
					index
					element={
						<ProtectedRoute authToken={authToken}>
							<Homepage userName={userName} />{" "}
						</ProtectedRoute>
					}
				/>
				<Route
					path="account"
					element={
						<ProtectedRoute authToken={authToken}>
							<AccountSettings
								userName={userName}
								setUserName={setUserName}
							/>
						</ProtectedRoute>
					}
				/>
				<Route
					path="images"
					element={
						<ProtectedRoute authToken={authToken}>
							<ImageGallery
								isLoading={isLoading}
								fetchedImages={fetchedImages}
							/>
						</ProtectedRoute>
					}
				/>
				<Route
					path="images/:imageId"
					element={
						<ProtectedRoute authToken={authToken}>
							<ImageDetails />{" "}
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path="/register" element={<RegisterPage />} />
			<Route
				path="/login"
				element={<LoginPage setAuthToken={setAuthToken} />}
			/>
		</Routes>
	);
}

export default App;
