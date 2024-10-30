import Link from 'next/link';
import React from 'react';

const pages = ['about', 'code', 'music', 'visuals', 'connect'];

export const Header = () => {
	return (
		<header>
			{pages.map((page) => (
				<h1 key={page}>
					<Link href={`/${page}`}>{page}</Link>
				</h1>
			))}
		</header>
	);
};
