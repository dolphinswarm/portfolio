import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from '@/styles/header.module.scss';

const pages = ['about', 'code', 'music', 'visuals', 'connect'];

export const Header = () => {
	return (
		<header className={styles.header}>
			{/* Logo */}
			<Link href='/'>
				<Image src='/img/brad-logo-2.png' alt='logo' width={242} height={100} />
			</Link>

			{/* Navbar */}
			<nav className={styles.navbar}>
				{pages.map((page) => (
					<Link href={`/${page}`} key={page}>
						{page}
					</Link>
				))}
			</nav>
		</header>
	);
};
