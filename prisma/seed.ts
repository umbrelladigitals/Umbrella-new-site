import { PrismaClient } from '@prisma/client'
import { projectsEn, projectsTr } from '../src/translations/projects'
import { servicesEn, servicesTr } from '../src/translations/services'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed Admin
  const password = await bcrypt.hash('umbrella2025', 10)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: password
    }
  })

  // Seed Projects
  for (const pEn of projectsEn) {
    const pTr = projectsTr.find(p => p.id === pEn.id)
    if (!pTr) continue

    // Check if exists
    const existing = await prisma.project.findFirst({ where: { id: pEn.id } })
    if (existing) continue

    await prisma.project.create({
      data: {
        id: pEn.id, // Preserve ID
        slug: pEn.slug,
        image: pEn.image,
        year: pEn.year,
        client: pEn.client,
        gallery: JSON.stringify(pEn.galleryImages),
        
        titleEn: pEn.title,
        categoryEn: pEn.category,
        tagsEn: JSON.stringify(pEn.tags),
        roleEn: pEn.role,
        descEn: pEn.description,
        challengeEn: pEn.challenge,
        solutionEn: pEn.solution,
        resultsEn: JSON.stringify(pEn.results),

        titleTr: pTr.title,
        categoryTr: pTr.category,
        tagsTr: JSON.stringify(pTr.tags),
        roleTr: pTr.role,
        descTr: pTr.description,
        challengeTr: pTr.challenge,
        solutionTr: pTr.solution,
        resultsTr: JSON.stringify(pTr.results),
      }
    })
  }

  // Seed Services
  const serviceIds = ['mobile', 'identity', 'uiux', 'web', 'marketing', '3d']
  const videos = [
    "/service-mobile.webm",
    "/service-identity.webm",
    "/service-uiux.webm",
    "/service-web.webm",
    "/service-marketing.webm",
    "/service-3d.webm"
  ]
  const tagsMap: Record<string, string[]> = {
      'mobile': ["React Native", "Flutter", "iOS & Android", "App Store Optimization"],
      'identity': ["Logo Design", "Typography Systems", "Brand Books", "Art Direction"],
      'uiux': ["Wireframing", "Prototyping", "User Testing", "Design Systems"],
      'web': ["Frontend", "React / Next.js", "WebGL", "CMS Integration"],
      'marketing': ["SEO / SEM", "Social Strategy", "Content Creation", "Analytics"],
      '3d': ["3D Modeling", "Motion Graphics", "Product Rendering", "Spline / Blender"]
  }

  for (let i = 0; i < serviceIds.length; i++) {
      const id = serviceIds[i]
      const sEn = servicesEn.page.items[i]
      const sTr = servicesTr.page.items[i]
      
      const existing = await prisma.service.findUnique({ where: { id } })
      if (existing) continue

      await prisma.service.create({
          data: {
              id: id,
              video: videos[i],
              
              titleEn: sEn.title,
              shortDescEn: sEn.shortDescription,
              descEn: sEn.description,
              challengeEn: sEn.challenge,
              solutionEn: sEn.solution,
              deliverablesEn: JSON.stringify(sEn.deliverables),
              tagsEn: JSON.stringify(tagsMap[id]),

              titleTr: sTr.title,
              shortDescTr: sTr.shortDescription,
              descTr: sTr.description,
              challengeTr: sTr.challenge,
              solutionTr: sTr.solution,
              deliverablesTr: JSON.stringify(sTr.deliverables),
              tagsTr: JSON.stringify(tagsMap[id]), 
          }
      })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
