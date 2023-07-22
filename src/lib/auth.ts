import { NextRequest, NextResponse } from "next/server"

function isAuthenticated(request: NextRequest) {
  // Check the request for authentication
  // and return a boolean
  return true
}

export { isAuthenticated }
