export interface Project {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Cloud Migration Plan",
    slug: "cloud-migration-plan",
    isOwned: true,
  },
  {
    id: "p2",
    name: "API Gateway Design",
    slug: "api-gateway-design",
    isOwned: true,
  },
  {
    id: "p3",
    name: "Auth Service",
    slug: "auth-service",
    isOwned: true,
  },
  {
    id: "p4",
    name: "Shared Platform Infra",
    slug: "shared-platform-infra",
    isOwned: false,
  },
  {
    id: "p5",
    name: "Data Pipeline — Q3",
    slug: "data-pipeline-q3",
    isOwned: false,
  },
]
