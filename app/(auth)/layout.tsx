import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex-center min-h-screen w-full background-light900_dark200 relative">
			<div className="z-10 h-screen flex-center">{children}</div>
			<div className="">
				<video
					className="absolute inset-0 w-screen h-screen blur-lg  object-cover"
					autoPlay
					loop
					muted
				>
					<source src="/assets/Sinusoidal.mp4" type="video/mp4" />
					<track src="/path/to/captions.vtt" kind="subtitles" label="English" />
					Your browser does not support the video tag.
				</video>
			</div>
		</main>
	);
};

export default Layout;
