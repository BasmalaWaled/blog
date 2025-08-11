import React from 'react'
import Link from 'next/link'
import styles from './header.module.css'

const Navbar = () => {
  return (
       <nav className={styles.navbar}>
            <div>
                <Link href="/" className={styles.logo}>Blog</Link>
            </div>
        <ul className={styles.navLinks}>
            <Link className={styles.navLink} href="/">Home</Link>
            <Link className={styles.navLink} href="/posts/create">create</Link>
        </ul>
        </nav>
  )
}

export default Navbar