/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as CreateImport } from './routes/create'
import { Route as TaskSlugImport } from './routes/$taskSlug'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const CreateRoute = CreateImport.update({
  id: '/create',
  path: '/create',
  getParentRoute: () => rootRoute,
} as any)

const TaskSlugRoute = TaskSlugImport.update({
  id: '/$taskSlug',
  path: '/$taskSlug',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$taskSlug': {
      id: '/$taskSlug'
      path: '/$taskSlug'
      fullPath: '/$taskSlug'
      preLoaderRoute: typeof TaskSlugImport
      parentRoute: typeof rootRoute
    }
    '/create': {
      id: '/create'
      path: '/create'
      fullPath: '/create'
      preLoaderRoute: typeof CreateImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/$taskSlug': typeof TaskSlugRoute
  '/create': typeof CreateRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/$taskSlug': typeof TaskSlugRoute
  '/create': typeof CreateRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/$taskSlug': typeof TaskSlugRoute
  '/create': typeof CreateRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/$taskSlug' | '/create'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/$taskSlug' | '/create'
  id: '__root__' | '/' | '/$taskSlug' | '/create'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  TaskSlugRoute: typeof TaskSlugRoute
  CreateRoute: typeof CreateRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  TaskSlugRoute: TaskSlugRoute,
  CreateRoute: CreateRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/$taskSlug",
        "/create"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/$taskSlug": {
      "filePath": "$taskSlug.tsx"
    },
    "/create": {
      "filePath": "create.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
