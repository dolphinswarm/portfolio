import React from 'react';

const pages = ['about', 'code', 'music', 'visuals', 'connect'];

export const Header = () => {
	return (
		<header>
			{pages.map((page) => (
				<h1 key={page}>{page}</h1>
			))}
		</header>
	);
};
