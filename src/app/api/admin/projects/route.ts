import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const formData = await req.formData()
  const data: any = {}
  
  formData.forEach((value, key) => {
    data[key] = value
  })

  const slug = data.slug || slugify(data.titleEn)

  try {
    const project = await prisma.project.create({
      data: {
        slug,
        image: data.image,
        year: data.year,
        client: data.client,
        gallery: data.gallery,
        published: data.published === 'true',
        
        titleEn: data.titleEn,
        categoryEn: data.categoryEn,
        tagsEn: data.tagsEn,
        roleEn: data.roleEn,
        descEn: data.descEn,
        challengeEn: data.challengeEn,
        solutionEn: data.solutionEn,
        resultsEn: data.resultsEn,

        titleTr: data.titleTr,
        categoryTr: data.categoryTr,
        tagsTr: data.tagsTr,
        roleTr: data.roleTr,
        descTr: data.descTr,
        challengeTr: data.challengeTr,
        solutionTr: data.solutionTr,
        resultsTr: data.resultsTr,
      }
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error(error)
    return new NextResponse('Error creating project', { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const formData = await req.formData()
  const id = formData.get('id')
  
  if (!id) return new NextResponse('Missing ID', { status: 400 })

  const data: any = {}
  formData.forEach((value, key) => {
    if (key !== 'id') data[key] = value
  })

  try {
    const updateData: any = {
        image: data.image,
        year: data.year,
        client: data.client,
        gallery: data.gallery,
        published: data.published === 'true',
        
        titleEn: data.titleEn,
        categoryEn: data.categoryEn,
        tagsEn: data.tagsEn,
        roleEn: data.roleEn,
        descEn: data.descEn,
        challengeEn: data.challengeEn,
        solutionEn: data.solutionEn,
        resultsEn: data.resultsEn,

        titleTr: data.titleTr,
        categoryTr: data.categoryTr,
        tagsTr: data.tagsTr,
        roleTr: data.roleTr,
        descTr: data.descTr,
        challengeTr: data.challengeTr,
        solutionTr: data.solutionTr,
        resultsTr: data.resultsTr,
    }

    if (data.slug) {
        updateData.slug = data.slug
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id as string) },
      data: updateData
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error(error)
    return new NextResponse('Error updating project', { status: 500 })
  }
}
