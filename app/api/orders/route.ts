import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/uploadFiles';

function generateCSN() {
  return `CSN-${Date.now().toString().slice(-7)}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ── Upload files if present ─────────────────────────────────
    const fileFields = [
      'uploadFile', 'repFile', 'companyIdCard',
      'companyAuthLetter', 'authLetter', 'identityImage', 'identitySelfie'
    ];

    const fileUrls: Record<string, string> = {};
    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        fileUrls[field] = await uploadFile(file, field);
      }
    }

    // ── Parse JSON fields ───────────────────────────────────────
    const lineItems = JSON.parse(formData.get('lineItems') as string || '[]');
    const addOns = JSON.parse(formData.get('addOns') as string || '[]');

    const getString = (key: string) => (formData.get(key) as string) || undefined;
    const getInt = (key: string) => {
      const v = formData.get(key);
      return v ? parseInt(v as string) : undefined;
    };

    // ── Build address JSON helpers ──────────────────────────────
    const repOrgAddress = {
      street: getString('repOrgStreet'),
      city: getString('repOrgCity'),
      state: getString('repOrgState'),
      country: getString('repOrgCountry'),
      landmark: getString('repOrgLandmark'),
    };

    const retrievalLocAddress = {
      street: getString('retrievalLocStreet'),
      city: getString('retrievalLocCity'),
      state: getString('retrievalLocState'),
      country: getString('retrievalLocCountry'),
    };

    const retrievalDeliveryAddress = {
      street: getString('retrievalDeliveryStreet'),
      city: getString('retrievalDeliveryCity'),
      state: getString('retrievalDeliveryState'),
      country: getString('retrievalDeliveryCountry'),
    };

    const companyAddress = {
      street: getString('companyStreet'),
      city: getString('companyCity'),
      state: getString('companyState'),
      country: getString('companyCountry'),
    };

    // ── Create order ────────────────────────────────────────────
    const order = await prisma.order.create({
      data: {
        csn: generateCSN(),
        primaryService: getString('primaryService')!,
        addOns,
        receiveMethod: getString('receiveMethod'),
        hardcopyType: getString('hardcopyDeliveryType'),
        uploadedFileUrl: fileUrls.uploadFile,
        uploadDesc: getString('uploadDesc'),
        docType: getString('docType'),
        docText: getString('docText'),
        formattingStyle: getString('formattingStyle'),
        pickupAddress: getString('pickupAddress'),
        pickupDate: getString('pickupDate') ? new Date(getString('pickupDate')!) : undefined,
        pickupTime: getString('pickupTime'),
        pickupContact: getString('pickupContact'),
        pickupPhone: getString('pickupPhone'),
        pickupNumDocs: getInt('pickupNumDocs'),
        pickupInstructions: getString('pickupInstructions'),
        courierCompany: getString('courierCompany'),
        courierTracking: getString('courierTracking'),
        courierContact: getString('courierContact'),
        courierPickupLoc: getString('courierPickupLocation'),
        courierInstructions: getString('courierInstructions'),
        submissionLocation: getString('submissionLocation'),
        submissionDate: getString('submissionDate') ? new Date(getString('submissionDate')!) : undefined,
        submissionInstructions: getString('submissionInstructions'),
        wantsFollowUp: getString('wantsFollowUp') === 'yes',
        followUpFrequency: getString('followUpFrequency'),
        followupDate: getString('followupDate') ? new Date(getString('followupDate')!) : undefined,
        followupLocation: getString('followupLocation'),
        followupStatus: getString('followupStatus'),
        followupRef: getString('followupRef'),
        repOrg: getString('repOrg'),
        repOrgAddress,
        repGender: getString('repGender'),
        repPurpose: getString('repPurpose'),
        repTopic: getString('repTopic'),
        repScript: getString('repScript'),
        repFileUrl: fileUrls.repFile,
        retrievalItem: getString('retrievalItem'),
        retrievalLocation: getString('retrievalLocationVal'),
        retrievalLocAddress,
        retrievalDate: getString('retrievalDate') ? new Date(getString('retrievalDate')!) : undefined,
        retrievalStatus: getString('retrievalStatus'),
        retrievalDelivery: getString('retrievalDelivery'),
        deliveryDistance: getString('deliveryDistance'),
        retrievalDeliveryAddress,
        isCompanyDocument: getString('isCompanyDocument'),
        companyName: getString('companyName'),
        companyCac: getString('companyCac'),
        companyPosition: getString('companyPosition'),
        companyIdCardUrl: fileUrls.companyIdCard,
        companyAuthMethod: getString('companyAuthMethod'),
        companyAddress,
        companyAuthLetterUrl: fileUrls.companyAuthLetter,
        authLetterUrl: fileUrls.authLetter,
        identityType: getString('identityType'),
        identityNumber: getString('identityNumber'),
        identityImageUrl: fileUrls.identityImage,
        identitySelfieUrl: fileUrls.identitySelfie,
        fullName: getString('fullName'),
        phone: getString('phone'),
        email: getString('email'),
        country: getString('country'),
        state: getString('stateVal'),
        city: getString('city'),
        landmark: getString('landmark'),
        streetAddress: getString('streetAddress'),
        lineItems,
        total: getInt('total') ?? 0,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, csn: order.csn, id: order.id }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation failed:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const orders = await prisma.order.findMany({
      where: {
        ...(status && status !== 'Total Order' ? { status: status.toUpperCase().replace(' ', '_') as any } : {}),
        ...(search ? {
          OR: [
            { csn: { contains: search, mode: 'insensitive' } },
            { fullName: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
          ]
        } : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, csn: true, fullName: true, phone: true,
        city: true, primaryService: true, total: true,
        status: true, createdAt: true,
      },
    });

    
    const counts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const total = await prisma.order.count();

    return NextResponse.json({ orders, counts, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}