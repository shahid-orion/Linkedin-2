// import { clerkMiddleware } from '@clerk/nextjs/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
	// '/',
	'/dashboard(.*)',
	'/forum(.*)'
])

// export default clerkMiddleware()
export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect()
})

export const config = {
	matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
