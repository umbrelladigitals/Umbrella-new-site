import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const formData = await req.formData()
  const data: any = {}
  
  formData.forEach((value, key) => {
    data[key] = value
  })

  try {
    const service = await prisma.service.create({
      data: {
        id: data.id,
        video: data.video,
        
        titleEn: data.titleEn,
        shortDescEn: data.shortDescEn,
        descEn: data.descEn,
        challengeEn: data.challengeEn,
        solutionEn: data.solutionEn,
        deliverablesEn: data.deliverablesEn,
        tagsEn: data.tagsEn,

        titleTr: data.titleTr,
        shortDescTr: data.shortDescTr,
        descTr: data.descTr,
        challengeTr: data.challengeTr,
        solutionTr: data.solutionTr,
        deliverablesTr: data.deliverablesTr,
        tagsTr: data.tagsTr,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    return new NextResponse('Error creating service', { status: 500 })
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
    const service = await prisma.service.update({
      where: { id: id as string },
      data: {
        video: data.video,
        
        titleEn: data.titleEn,
        shortDescEn: data.shortDescEn,
        descEn: data.descEn,
        challengeEn: data.challengeEn,
        solutionEn: data.solutionEn,
        deliverablesEn: data.deliverablesEn,
        tagsEn: data.tagsEn,

        titleTr: data.titleTr,
        shortDescTr: data.shortDescTr,
        descTr: data.descTr,
        challengeTr: data.challengeTr,
        solutionTr: data.solutionTr,
        deliverablesTr: data.deliverablesTr,
        tagsTr: data.tagsTr,
      }
    })
    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    return new NextResponse('Error updating service', { status: 500 })
  }
}
