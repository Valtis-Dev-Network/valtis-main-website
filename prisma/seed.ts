import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const starterWarning = "These template policies are starter documents and should be reviewed before public launch.";

const UserRole = { ADMIN: "ADMIN", DIRECTOR: "DIRECTOR", SAFEGUARDING_LEAD: "SAFEGUARDING_LEAD", MODERATOR: "MODERATOR", EDITOR: "EDITOR", VIEWER: "VIEWER" } as const;
const ApprovalStatus = { PENDING: "PENDING", APPROVED: "APPROVED", REJECTED: "REJECTED", ARCHIVED: "ARCHIVED" } as const;
const ProjectCategory = {
  PLUGIN: "PLUGIN",
  MOD: "MOD",
  RESOURCE_PACK: "RESOURCE_PACK",
  SERVER: "SERVER",
  SERVER_NETWORK: "SERVER_NETWORK",
  INFRASTRUCTURE: "INFRASTRUCTURE",
  WEBSITE: "WEBSITE",
  TOOLING: "TOOLING",
  LIBRARY: "LIBRARY",
  COMMUNITY: "COMMUNITY",
  OTHER: "OTHER"
} as const;
const ProjectStatus = { CONCEPT: "CONCEPT", IN_DEVELOPMENT: "IN_DEVELOPMENT", ACTIVE: "ACTIVE", MAINTAINED: "MAINTAINED", PAUSED: "PAUSED", ARCHIVED: "ARCHIVED" } as const;
const ResourceStatus = { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", ARCHIVED: "ARCHIVED" } as const;
const ResourceType = {
  GUIDE: "GUIDE",
  ARTICLE: "ARTICLE",
  DOCUMENTATION: "DOCUMENTATION",
  TUTORIAL: "TUTORIAL",
  OPINION: "OPINION",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  SECURITY_NOTE: "SECURITY_NOTE",
  BEST_PRACTICE: "BEST_PRACTICE"
} as const;
const InitiativeStatus = { PLANNED: "PLANNED", ACTIVE: "ACTIVE", PAUSED: "PAUSED", COMPLETED: "COMPLETED", ARCHIVED: "ARCHIVED" } as const;
const ReportType = { PROJECT: "PROJECT", DEVELOPER: "DEVELOPER", RESOURCE: "RESOURCE", COMMUNITY: "COMMUNITY", SAFEGUARDING: "SAFEGUARDING", SECURITY: "SECURITY", OTHER: "OTHER" } as const;
const ReportUrgency = { LOW: "LOW", NORMAL: "NORMAL", HIGH: "HIGH", URGENT: "URGENT" } as const;
const SafeguardingRisk = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH", URGENT: "URGENT" } as const;
const SafeguardingStatus = { OPEN: "OPEN", REVIEWING: "REVIEWING", ESCALATED: "ESCALATED", CLOSED: "CLOSED", ARCHIVED: "ARCHIVED" } as const;
const LegalDocumentType = {
  TERMS: "TERMS",
  PRIVACY: "PRIVACY",
  COOKIES: "COOKIES",
  SAFEGUARDING: "SAFEGUARDING",
  COMMUNITY_GUIDELINES: "COMMUNITY_GUIDELINES",
  ACCEPTABLE_USE: "ACCEPTABLE_USE",
  DISCORD_RULES: "DISCORD_RULES"
} as const;
const LegalDocumentStatus = { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", ARCHIVED: "ARCHIVED" } as const;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function markdown(title: string, sections: string[]) {
  return [`> ${starterWarning}`, "", `# ${title}`, "", ...sections].join("\n\n");
}

const legalDocs = [
  {
    type: LegalDocumentType.TERMS,
    title: "Terms of Service",
    slug: "terms",
    content: markdown("Terms of Service", [
      "## Introduction\nValtis is an independent network for Minecraft developers, creators and technical communities.",
      "## Acceptance of Terms\nUsing this website means you agree to these terms.",
      "## Eligibility\nSome features may require users to be at least 13. Users under 18 should have parent or guardian permission where required.",
      "## Accounts\nStaff accounts must keep credentials secure and must not be shared.",
      "## Submissions\nProject submissions, developer profiles, resources and other content may be moderated before publication.",
      "## Community Standards\nUsers must be respectful, lawful and safe.",
      "## Prohibited Conduct\nHarassment, hate speech, abuse, threats, sexual content involving minors, exploitation, doxxing, malware, spam, scam links, impersonation, copyright infringement, private data sharing and attempts to bypass moderation or security are prohibited.",
      "## Intellectual Property\nUsers retain rights to their own content but grant Valtis permission to display submitted content on the platform.",
      "## Open Source Projects\nExternal project licences are controlled by the project owners.",
      "## Third-Party Links\nValtis may link to GitHub, Discord, project sites and external resources.",
      "## Minecraft/Mojang/Microsoft Disclaimer\nValtis is independent and is not affiliated with Mojang Studios or Microsoft.",
      "## Moderation\nValtis may approve, reject, edit, archive or remove content to protect quality, safety and trust.",
      "## Termination\nValtis may restrict access for policy breaches.",
      "## Limitation of Liability\nValtis is provided on a reasonable efforts basis and is not liable for indirect losses to the extent permitted by law.",
      "## Changes to Terms\nTerms are versioned and updates are published on this page.",
      "## Contact\nContact Valtis through /contact."
    ])
  },
  {
    type: LegalDocumentType.PRIVACY,
    title: "Privacy Policy",
    slug: "privacy",
    content: markdown("Privacy Policy", [
      "## Introduction\nThis policy explains how Valtis handles data for a developer platform and community network.",
      "## Data We Collect\nContact form data, report form data, project submissions, developer profile submissions, staff account data, technical logs, cookie preferences and optional Discord, GitHub or profile links.",
      "## How We Use Data\nWe use data to operate the website, review submissions, moderate content, respond to messages and reports, maintain security, manage staff access, improve the platform and meet legal or safety obligations.",
      "## Lawful Basis Placeholder\nThe lawful basis for each processing activity should be reviewed before launch.",
      "## Data Sharing\nData is shared only where needed with hosting, database, authentication or email providers, legal or safety authorities where required. Valtis does not sell personal data.",
      "## Public Content\nApproved project and developer profile information becomes publicly visible.",
      "## Safeguarding and Safety Reports\nSafety and safeguarding reports may be handled by restricted authorised staff and escalated where necessary.",
      "## Data Retention\nContact messages default to 12 months, reports are retained only as long as necessary, audit logs default to 24 months, and cookie consent logs default to 12 months.",
      "## User Rights\nUsers can request access, correction or deletion where applicable.",
      "## Cookies\nSee the cookie policy for preference controls.",
      "## Security\nValtis uses reasonable security measures including hashed staff passwords and role-based access.",
      "## International Transfers Placeholder\nHosting and provider locations should be reviewed before launch.",
      "## Children and Young People\nValtis is not intentionally designed to collect unnecessary personal data from children and encourages parent or guardian involvement where appropriate.",
      "## Changes\nPrivacy updates are versioned.",
      "## Contact\nContact Valtis through /contact."
    ])
  },
  {
    type: LegalDocumentType.COOKIES,
    title: "Cookie Policy",
    slug: "cookies",
    content: markdown("Cookie Policy", [
      "## What Cookies Are\nCookies help websites remember sessions and preferences.",
      "## Essential Cookies\nEssential cookies support staff authentication, consent state and security.",
      "## Preference Cookies\nPreference cookies can remember reduced motion and theme choices.",
      "## Analytics Cookies\nAnalytics are disabled by default unless configured and consented to.",
      "## Marketing Cookies\nNo marketing cookies are enabled by default.",
      "## Cookie Table\nEssential: valtis_cookie_consent, staff session cookie, CSRF/security cookie if added. Preference: valtis_theme, valtis_reduced_motion. Analytics: none enabled by default. Marketing: none by default.",
      "## Changing Preferences\nUse the Cookie Settings link in the footer."
    ])
  },
  {
    type: LegalDocumentType.SAFEGUARDING,
    title: "Safeguarding Policy",
    slug: "safeguarding",
    content: markdown("Safeguarding Policy", [
      "## Purpose\nValtis aims to provide a safer technical community for Minecraft developers, creators and communities.",
      "## Scope\nThis applies to the website, submissions, staff activity, official community spaces where applicable and Valtis-run initiatives.",
      "## Principles\nSafety first, listen and act, minimise data, respect privacy, do not ignore concerns, escalate serious issues, keep records appropriately and restrict sensitive reports.",
      "## Expected Behaviour\nAll users, staff and volunteers must behave respectfully and safely.",
      "## Prohibited Behaviour\nHarassment, grooming, sexualised communication with minors, exploitation, threats, doxxing, bullying, hate speech, encouraging self-harm, sharing private personal information, unsafe one-to-one contact and attempts to move concerns into hidden channels are prohibited.",
      "## Reporting Concerns\nUse /report for safeguarding concerns. Urgent danger should be reported to emergency or local authorities immediately.",
      "## How Valtis Handles Concerns\nValtis may acknowledge, restrict access, record actions, escalate, moderate, preserve evidence and respect confidentiality without promising absolute secrecy.",
      "## Staff Responsibilities\nStaff must report concerns internally, avoid acting beyond competence and follow escalation procedures.",
      "## Safer Community Practice\nPrefer transparent moderation channels, avoid unnecessary private contact with minors, document decisions, use role-based access and encourage parent or guardian involvement where appropriate.",
      "## Data Handling\nSafeguarding records are sensitive and should only be accessible to authorised roles.",
      "## Review\nThis starter safeguarding policy should be reviewed by an appropriate safeguarding lead before public launch."
    ])
  },
  {
    type: LegalDocumentType.COMMUNITY_GUIDELINES,
    title: "Community Guidelines",
    slug: "community-guidelines",
    content: markdown("Community Guidelines", [
      "Be respectful. Keep discussions technical and constructive. No harassment, hate speech, doxxing, NSFW content, malware, scam links, stolen code or stolen assets. Credit creators, respect licences, use appropriate channels, report concerns and understand that staff decisions may be reviewed internally."
    ])
  },
  {
    type: LegalDocumentType.ACCEPTABLE_USE,
    title: "Acceptable Use Policy",
    slug: "acceptable-use",
    content: markdown("Acceptable Use Policy", [
      "Do not use Valtis for illegal content, malicious code, credential theft, harmful exploit sharing, spam, impersonation, form or API abuse, harmful scraping, authentication bypass attempts, harmful uploads or coordinating harassment and attacks."
    ])
  },
  {
    type: LegalDocumentType.DISCORD_RULES,
    title: "Discord Policy",
    slug: "discord",
    content: markdown("Discord Policy", [
      "Discord may be used as the community layer. Discord is separate from the website and has its own terms and privacy policy. Valtis rules still apply in official spaces, moderation actions may apply across Valtis spaces, and safety reports can be submitted through the website."
    ])
  }
];

const projectNames = [
  "Velocity Guardrails",
  "Paperflow Utilities",
  "Fabric Bridge Kit",
  "Blockwatch Telemetry",
  "DocsForge",
  "Network Console",
  "Quartz Analytics",
  "Permaline",
  "ModShield",
  "VoxelKit"
];

const skills = ["Plugin Development", "Mod Development", "Server Infrastructure", "Web Development", "UI/UX", "Documentation", "Security", "DevOps", "Java", "TypeScript"];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.safeguardingNote.deleteMany();
  await prisma.safeguardingCase.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.initiativeUpdate.deleteMany();
  await prisma.initiativeMember.deleteMany();
  await prisma.initiative.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.developerSkill.deleteMany();
  await prisma.developerProfile.deleteMany();
  await prisma.projectTag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.cookieConsent.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "alfiepineapple@gmail.com",
      name: "Alfie Pineapple",
      passwordHash: await bcrypt.hash("change-me-now", 12),
      role: UserRole.ADMIN
    }
  });

  const tagRecords = await Promise.all(
    ["Paper", "Velocity", "Fabric", "Open Source", "Security", "Monitoring", "Documentation", "Dashboard", "Libraries", "Moderation"].map((name) =>
      prisma.tag.create({ data: { name } })
    )
  );

  for (let index = 0; index < projectNames.length; index++) {
    const project = await prisma.project.create({
      data: {
        name: projectNames[index],
        slug: slugify(projectNames[index]),
        shortDescription: "A polished Minecraft development project built around quality, maintainability and technical community impact.",
        fullDescription:
          "This project demonstrates the kind of careful tooling Valtis exists to support: clear documentation, transparent development, practical infrastructure and maintainable software for server operators and creators.",
        category: Object.values(ProjectCategory)[index % Object.values(ProjectCategory).length],
        ownerName: ["Aster Labs", "Northbyte", "Open Crafting Collective", "Valtis Maintainers"][index % 4],
        ownerProfileLink: "/developers",
        websiteUrl: `https://projects.valtis.local/${slugify(projectNames[index])}`,
        githubUrl: `https://github.com/valtis-network/${slugify(projectNames[index])}`,
        documentationUrl: `https://docs.valtis.local/${slugify(projectNames[index])}`,
        status: Object.values(ProjectStatus)[index % Object.values(ProjectStatus).length],
        approvalStatus: index < 8 ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING,
        featured: index < 3,
        tags: {
          create: [
            { tag: { connect: { id: tagRecords[index % tagRecords.length].id } } },
            { tag: { connect: { id: tagRecords[(index + 3) % tagRecords.length].id } } }
          ]
        }
      }
    });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "seed.project.created", entityType: "Project", entityId: project.id, entityName: project.name }
    });
  }

  for (let index = 0; index < 10; index++) {
    const profile = await prisma.developerProfile.create({
      data: {
        displayName: ["Nova", "Kade", "Mira", "Ellis", "Rowan", "Sora", "Jules", "Iris", "Keir", "Lina"][index] + " Hart",
        slug: slugify(["Nova", "Kade", "Mira", "Ellis", "Rowan", "Sora", "Jules", "Iris", "Keir", "Lina"][index] + " Hart"),
        bio: "A technical creator focused on reliable Minecraft tooling, readable documentation and practical systems that help communities ship better projects.",
        roleTitle: ["Plugin Engineer", "Infrastructure Lead", "Mod Developer", "Documentation Writer", "Frontend Engineer"][index % 5],
        specialisations: "Performance, maintainability, community tooling",
        github: `https://github.com/valtis-network/dev-${index + 1}`,
        website: `https://profiles.valtis.local/developer-${index + 1}`,
        discordUsername: `valtis.dev.${index}`,
        availability: ["Available", "Limited", "Open to Collaborations", "Open to Paid Work", "Open Source Only"][index % 5],
        badges: JSON.stringify(["Verified", "Open Source"]),
        verified: index < 5,
        approvalStatus: index < 9 ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING,
        featured: index < 4,
        skills: {
          create: [skills[index % skills.length], skills[(index + 3) % skills.length], skills[(index + 6) % skills.length]].map((name) => ({ name }))
        }
      }
    });
    await prisma.auditLog.create({
      data: { userId: admin.id, action: "seed.developer.created", entityType: "DeveloperProfile", entityId: profile.id, entityName: profile.displayName }
    });
  }

  const initiativeNames = [
    "Open Source Plugin Development",
    "Developer Mentoring",
    "Documentation Projects",
    "Community Events",
    "Infrastructure Collaborations",
    "Security & Best Practice"
  ];

  for (let index = 0; index < initiativeNames.length; index++) {
    await prisma.initiative.create({
      data: {
        name: initiativeNames[index],
        slug: slugify(initiativeNames[index]),
        summary: "A community-backed effort helping Minecraft technical communities collaborate with more structure and trust.",
        description:
          "Valtis initiatives are programmes, working groups and shared efforts that turn scattered technical energy into visible, documented and maintainable outcomes.",
        status: index < 4 ? InitiativeStatus.ACTIVE : InitiativeStatus.PLANNED,
        goals: JSON.stringify(["Publish clear guidance", "Recruit maintainers", "Share progress publicly"]),
        progress: 25 + index * 10,
        tags: JSON.stringify(["Community", "Open Development"]),
        featured: index < 3,
        members: { create: [{ name: "Valtis Core", role: "Coordinator" }, { name: "Community Contributors", role: "Working group" }] },
        updates: { create: [{ title: "Kickoff published", body: "The first roadmap and participation notes have been published." }] }
      }
    });
  }

  for (let index = 0; index < 12; index++) {
    await prisma.resource.create({
      data: {
        title: `Valtis Field Guide ${index + 1}`,
        slug: `valtis-field-guide-${index + 1}`,
        excerpt: "Practical guidance for building safer, cleaner and more maintainable Minecraft development projects.",
        content:
          "# Field Guide\n\nValtis resources focus on production habits: clear changelogs, safer moderation flows, maintainable APIs, useful documentation and transparent project governance.\n\n## Checklist\n\n- Define ownership\n- Document support boundaries\n- Review security-sensitive changes\n- Keep public docs current",
        type: Object.values(ResourceType)[index % Object.values(ResourceType).length],
        category: ["Engineering", "Community", "Security", "Documentation"][index % 4],
        author: "Valtis Editorial",
        readTime: 4 + (index % 5),
        status: ResourceStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - index * 86400000),
        featured: index < 4,
        tags: JSON.stringify(["Guide", "Best Practice"])
      }
    });
  }

  for (let index = 0; index < 8; index++) {
    await prisma.contactMessage.create({
      data: {
        name: `Community Member ${index + 1}`,
        email: `community.member.${index + 1}@valtis.local`,
        topic: ["General", "Project Submission", "Partnership", "Safety Concern"][index % 4],
        message: "I would like to talk with Valtis about a technical community project and possible collaboration."
      }
    });
  }

  for (let index = 0; index < 6; index++) {
    await prisma.report.create({
      data: {
        type: Object.values(ReportType)[index % Object.values(ReportType).length],
        relatedUrl: "/projects/velocity-guardrails",
        name: index % 2 === 0 ? `Reporter ${index}` : null,
        email: index % 2 === 0 ? `reporter.${index}@valtis.local` : null,
        message: "Demo report used for local dashboard testing. This does not describe a real incident.",
        urgency: Object.values(ReportUrgency)[index % Object.values(ReportUrgency).length],
        consentToContact: index % 2 === 0,
        anonymous: index % 2 !== 0,
        safeguardingFlag: index === 1
      }
    });
  }

  for (let index = 0; index < 2; index++) {
    await prisma.safeguardingCase.create({
      data: {
        caseNumber: `DEMO-SG-${String(index + 1).padStart(3, "0")}`,
        title: `Demo safeguarding case ${index + 1}`,
        status: index === 0 ? SafeguardingStatus.REVIEWING : SafeguardingStatus.OPEN,
        riskLevel: index === 0 ? SafeguardingRisk.MEDIUM : SafeguardingRisk.LOW,
        summary: "Fake/demo case for local testing only. Do not treat this as a real safeguarding record.",
        actionsTaken: "Seeded for dashboard workflow testing.",
        assignedToId: admin.id,
        notes: { create: [{ author: "Seed", body: "Demo note. Sensitive production cases should use restricted access only." }] }
      }
    });
  }

  for (const doc of legalDocs) {
    await prisma.legalDocument.create({
      data: {
        ...doc,
        version: "0.1",
        status: LegalDocumentStatus.PUBLISHED,
        publishedAt: new Date(),
        updatedById: admin.id
      }
    });
  }

  for (let index = 0; index < 20; index++) {
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: ["approve", "publish", "archive", "review"][index % 4],
        entityType: ["Project", "DeveloperProfile", "Resource", "Report"][index % 4],
        entityName: `Seeded item ${index + 1}`,
        metadata: JSON.stringify({ source: "seed" })
      }
    });
  }

  await prisma.siteSetting.create({
    data: {
      key: "platform",
      value: JSON.stringify({
        discordUrl: "https://discord.gg/valtis",
        githubUrl: "https://github.com/valtis-network"
      })
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
