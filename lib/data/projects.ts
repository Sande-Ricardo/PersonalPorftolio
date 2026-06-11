export interface ProjectMetric {
  label: string
  value: string
  desc: string
}

export interface ProjectItem {
  slug: string
  title: string
  type: string
  category: string
  status: string
  date: string
  description: string
  longDescription: string
  bullets: string[]
  metrics: ProjectMetric[]
  asciiArt?: string
  codeFilename?: string
  codeSnippet?: string
  githubUrl: string
  liveUrl?: string
  stats: Record<string, string> // short telemetry stats for the homepage cards
}

export const projects: ProjectItem[] = [
  {
    slug: "nexus-core",
    title: "NEXUS.CORE",
    type: "DISTRIBUTED",
    category: "DISTRIBUTED SYSTEMS",
    status: "STABLE / PRODUCTION",
    date: "05/2024",
    description: "A high-throughput distributed message queue built in Go. Designed for ephemeral state management and real-time telemetry processing.",
    longDescription: "Nexus.Core is an ultra-low-latency distributed vector synchronization engine designed for real-time AI agents. By leveraging custom-built gRPC streams and an aggressive caching strategy using tiered Redis deployments, the system achieves sub-millisecond propagation delays across global regions.",
    bullets: [
      "High-availability sharding logic for vector databases.",
      "Custom Go-based middleware for intelligent request routing.",
      "Automated failover protocols with zero-data-loss guarantees."
    ],
    metrics: [
      { label: "PERFORMANCE_METRIC_01", value: "+240%", desc: "Efficiency optimization in data indexing" },
      { label: "PERFORMANCE_METRIC_02", value: "70ms", desc: "P99 Latency reduction across clusters" }
    ],
    asciiArt: `+--------------+      +-------------+      +-------------------+
|   CLIENT     | ---> |   FASTAPI   | ---> |  PINECONE / REDIS |
| (REACTION)   |      |  (ORCHESTR) |      |   (VECTOR_CORE)   |
+--------------+      +-------------+      +-------------------+
       ^                     |                      |
       |                     v                      v
       |              +-------------+      +-------------------+
       +--------------| DATA_PIPELINE| <--- |   WORKER_NODES    |
                      +-------------+      +-------------------+`,
    codeFilename: "nexus_service.go",
    codeSnippet: `// Package core implements the primary vector routing logic
package main

func InitStream(ctx context.Context, nodeID string) error {
    // Register node with the central orchestrator
    conn, err := grpc.Dial(MasterAddr, grpc.WithInsecure())
    if err != nil {
        return fmt.Errorf("CRITICAL: Failed to bind node %s", nodeID)
    }
    
    defer conn.Close()
    // Initialize bi-directional stream for vector updates
    return stream.Sync(ctx, conn)
}`,
    githubUrl: "https://github.com",
    liveUrl: "https://github.com",
    stats: {
      "LATENCY": "< 5ms",
      "THROUGHPUT": "100k msg/s"
    }
  },
  {
    slug: "synapse-ai",
    title: "SYNAPSE.AI",
    type: "ML_PIPELINE",
    category: "AI / MACHINE LEARNING",
    status: "BETA / TESTING",
    date: "11/2025",
    description: "Enterprise RAG implementation leveraging vector databases and custom embedding models to interrogate internal documentation silos.",
    longDescription: "Synapse.AI is a modular enterprise solution focused on extracting, embedding, and indexing massive amounts of unstructured data. Using state-of-the-art sentence transformers and contextual rerankers, it yields highly precise document retrievals tailored for LLM consumption.",
    bullets: [
      "Hybrid dense-sparse vector indexing for optimized recall.",
      "Custom semantic chunking pipeline supporting hierarchical document structures.",
      "Integrated feedback loop to continuously tune embedding weights."
    ],
    metrics: [
      { label: "ACCURACY_RATE", value: "94.2%", desc: "Retrieval precision on standard corpus tests" },
      { label: "CORPUS_SIZE", value: "2.4TB", desc: "Indexed document volume processed" }
    ],
    asciiArt: `+----------------+      +------------------+      +-------------------+
|  RAW DOCUMENTS | ---> |  EMBEDDING MODEL | ---> |  VECTOR INDEX DB  |
|  (PDF, TXT...) |      | (SENTENCE-TRANS) |      |    (PINECONE)     |
+----------------+      +------------------+      +-------------------+
                                                           ^
+----------------+      +------------------+               |
|   USER QUERY   | ---> |  HYBRID RETRIEVER| --------------+
+----------------+      +------------------+`,
    codeFilename: "embed_pipeline.py",
    codeSnippet: `def compute_embeddings(chunks: List[str]) -> np.ndarray:
    # Load custom transformer weights
    model = AutoModel.from_pretrained("./weights/synapse-v1")
    tokens = tokenizer(chunks, padding=True, truncation=True, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**tokens)
    # Mean pooling for sentence representation
    return outputs.last_hidden_state.mean(dim=1).numpy()`,
    githubUrl: "https://github.com",
    stats: {
      "ACCURACY": "94.2%",
      "CORPUS": "2.4TB"
    }
  },
  {
    slug: "aura-ui",
    title: "AURA.UI",
    type: "FRONTEND",
    category: "DESIGN SYSTEMS",
    status: "STABLE / PRODUCTION",
    date: "08/2025",
    description: "Minimalist, brutalist design system and component library built with React and TailwindCSS. Strictly enforces a 4px architectural grid.",
    longDescription: "Aura.UI is a React component library built strictly on an achromatic, pixel-perfect brutalist theme. It eliminates rounded corners, highlights functional outlines, and utilizes monospace typography to create developer-first control panels and clean modern portfolios.",
    bullets: [
      "Pixel-perfect 4px spacing baseline alignment rules.",
      "Fully accessible keyboard navigation across all interactive widgets.",
      "Strict CSS-variable layout architecture optimized for light/dark switching."
    ],
    metrics: [
      { label: "COMPONENT_COUNT", value: "42+", desc: "Fully-documented reusable visual widgets" },
      { label: "TEST_COVERAGE", value: "100%", desc: "Unit and integration test suites passing" }
    ],
    asciiArt: `+-------------+      +-----------------+      +-------------------+
| DESIGN TOK  | ---> |   TAILWIND V4   | ---> |  AURA COMPONENT   |
| (CONFIG.JS) |      |   (@theme css)  |      |   (BUTTON, CARD)  |
+-------------+      +-----------------+      +-------------------+`,
    codeFilename: "button.tsx",
    codeSnippet: `import React from 'react'

export const BrutalistButton = ({ children, ...props }) => (
  <button 
    className="border border-white bg-black text-white hover:bg-white hover:text-black transition-colors rounded-none px-4 py-2 font-mono" 
    {...props}
  >
    {children}
  </button>
)`,
    githubUrl: "https://github.com",
    stats: {
      "COMPONENTS": "42",
      "COVERAGE": "100%"
    }
  },
  {
    slug: "vortex-ops",
    title: "VORTEX.OPS",
    type: "INFRA",
    category: "INFRASTRUCTURE / DEVOPS",
    status: "STABLE / PRODUCTION",
    date: "02/2026",
    description: "Infrastructure-as-Code (IaC) templates using Terraform to deploy robust Kubernetes clusters with integrated monitoring and CI/CD pipelines.",
    longDescription: "Vortex.Ops is a complete blueprint library for infrastructure provisioning. It implements automated Kubernetes clustering, multi-tenant network partitioning, and automated Prometheus/Grafana stack configurations with declarative deployments.",
    bullets: [
      "Zero-touch provisioning scripts for multi-node K8s clusters.",
      "State preservation logic and backup strategies.",
      "Integrated Prometheus metrics exporter with Grafana dashboards."
    ],
    metrics: [
      { label: "PROVISION_TIME", value: "<12m", desc: "Total time to spin up multi-region clusters" },
      { label: "SCALING_CAP", value: "Auto-scale", desc: "Dynamic horizontal node cluster scaling" }
    ],
    asciiArt: `+---------------+      +-------------+      +-------------------+
| TERRAFORM IaC | ---> |   AWS EKS   | ---> | KUBERNETES PODS   |
|   (VORTEX)    |      | (PROVISION) |      | (PROMETHEUS MON)  |
+---------------+      +-------------+      +-------------------+`,
    codeFilename: "cluster.tf",
    codeSnippet: `module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.0.0"
  cluster_name    = "vortex-production"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
}`,
    githubUrl: "https://github.com",
    stats: {
      "DEPLOY TIME": "< 12m",
      "NODES": "Auto-scale"
    }
  }
]

export const getProjectBySlug = (slug: string): ProjectItem | undefined => {
  return projects.find((p) => p.slug === slug)
}
