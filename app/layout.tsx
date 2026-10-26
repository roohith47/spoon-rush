import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Spoon Rush — Keep your cards close. Watch the spoons.',description:'A multiplayer card game of quiet grabs and quick reactions. Join your friends, collect four of a kind, and do not be the last to grab.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
