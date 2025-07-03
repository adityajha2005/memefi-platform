import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Check for Pinata JWT token
    const pinataJWT = process.env.PINATA_JWT
    if (!pinataJWT) {
      console.error('PINATA_JWT environment variable not set')
      return NextResponse.json(
        { error: 'IPFS service not configured' },
        { status: 500 }
      )
    }

    // Prepare form data for Pinata
    const pinataFormData = new FormData()
    pinataFormData.append('file', file)
    
    // Add metadata
    const metadata = JSON.stringify({
      name: `meme-${Date.now()}-${file.name}`,
      keyvalues: {
        platform: 'memefi',
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString()
      }
    })
    pinataFormData.append('pinataMetadata', metadata)

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`,
      },
      body: pinataFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinata upload failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to upload to IPFS' },
        { status: 500 }
      )
    }

    const result = await response.json()
    
    // Verify the upload was successful
    if (!result.IpfsHash) {
      return NextResponse.json(
        { error: 'Upload succeeded but no IPFS hash returned' },
        { status: 500 }
      )
    }

    console.log('Successfully uploaded to IPFS:', result.IpfsHash)

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    })

  } catch (error) {
    console.error('IPFS upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error during IPFS upload' },
      { status: 500 }
    )
  }
} 