export function AccountSettings({ userName, setUserName }) {
	return (
		<div>
			<h2>Account settings</h2>
			<label>
				Username{" "}
				<input
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
			</label>
			<p>
				<i>Changes are auto-saved.</i>
			</p>
		</div>
	);
}
