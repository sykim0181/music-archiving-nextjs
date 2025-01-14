import localFont from 'next/font/local';
import { Bebas_Neue } from "next/font/google";

export const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-babas-neue",
  subsets: ['latin']
});

export const freesentation = localFont({
  src: './fonts/Freesentation-5Medium.ttf',
  variable: "--font-freesentation"
});
