import './globals.css'

export const metadata = {
title: 'HECSAP Dashboard',
description: 'Hospitalizaciones Evitables - Marzo 2026',
}

export default function RootLayout({ children }) {
return (
<html lang="es">
<body>{children}</body>
</html>
)
}
