"use client"

import type React from "react"
import { useRef, useEffect, useMemo, useState } from "react"
import { THREE, Canvas, useLoader, useFrame } from "@/lib/three-exports"

interface MinecraftHead3DProps {
  textureUrl: string
  className?: string
  fallbackContent?: React.ReactNode
}

function HeadMesh({ textureUrl }: { textureUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const overlayRef = useRef<THREE.Mesh>(null)
  const [error, setError] = useState(false)

  const texture = useLoader(THREE.TextureLoader, textureUrl, undefined, (error) => {
    console.error("Error loading texture:", error)
    setError(true)
  })

  const materials = useMemo(() => {
    if (!texture || error) return { baseMaterials: [], overlayMaterials: [] }

    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter

    const createFaceTexture = (x: number, y: number, width: number, height: number) => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (ctx && texture.image) {
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(texture.image, x, y, width, height, 0, 0, width, height)
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const avg = (r + g + b) / 3
          data[i] = r + (r - avg) * 0.3
          data[i + 1] = g + (g - avg) * 0.3
          data[i + 2] = b + (b - avg) * 0.3
        }
        ctx.putImageData(imageData, 0, 0)
      }

      const faceTexture = new THREE.CanvasTexture(canvas)
      faceTexture.magFilter = THREE.NearestFilter
      faceTexture.minFilter = THREE.NearestFilter
      return faceTexture
    }

    const baseMaterials = [
      new THREE.MeshBasicMaterial({ map: createFaceTexture(0, 8, 8, 8) }), // right
      new THREE.MeshBasicMaterial({ map: createFaceTexture(16, 8, 8, 8) }), // left
      new THREE.MeshBasicMaterial({ map: createFaceTexture(8, 0, 8, 8) }), // top
      new THREE.MeshBasicMaterial({ map: createFaceTexture(16, 0, 8, 8) }), // bottom
      new THREE.MeshBasicMaterial({ map: createFaceTexture(8, 8, 8, 8) }), // front
      new THREE.MeshBasicMaterial({ map: createFaceTexture(24, 8, 8, 8) }), // back
    ]

    const overlayMaterials = [
      new THREE.MeshBasicMaterial({ map: createFaceTexture(32, 8, 8, 8), transparent: true }), // right
      new THREE.MeshBasicMaterial({ map: createFaceTexture(48, 8, 8, 8), transparent: true }), // left
      new THREE.MeshBasicMaterial({ map: createFaceTexture(40, 0, 8, 8), transparent: true }), // top
      new THREE.MeshBasicMaterial({ map: createFaceTexture(48, 0, 8, 8), transparent: true }), // bottom
      new THREE.MeshBasicMaterial({ map: createFaceTexture(40, 8, 8, 8), transparent: true }), // front
      new THREE.MeshBasicMaterial({ map: createFaceTexture(56, 8, 8, 8), transparent: true }), // back
    ]

    return { baseMaterials, overlayMaterials }
  }, [texture, error])

  useEffect(() => {
    if (meshRef.current && materials.baseMaterials.length > 0) {
      meshRef.current.material = materials.baseMaterials
    }
    if (overlayRef.current && materials.overlayMaterials.length > 0) {
      overlayRef.current.material = materials.overlayMaterials
    }
  }, [materials])

  useFrame((state) => {
    if (meshRef.current && overlayRef.current) {
      const rotation = state.clock.getElapsedTime() * 0.5
      meshRef.current.rotation.y = rotation
      overlayRef.current.rotation.y = rotation
    }
  })

  if (error) {
    return null
  }

  return (
    <group scale={[1, 1, 1]} position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh ref={overlayRef} scale={[1.05, 1.05, 1.05]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    </group>
  )
}

function Scene({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      {children}
    </>
  )
}

export default function MinecraftHead3D({ textureUrl, className, fallbackContent }: MinecraftHead3DProps) {
  const [textureExists, setTextureExists] = useState(true)

  useEffect(() => {
    const checkTextureExists = async () => {
      try {
        // Check if the URL is valid before making the request
        if (
          !textureUrl ||
          textureUrl === "https://textures.minecraft.net/texture/" ||
          textureUrl.includes("texture-")
        ) {
          setTextureExists(false)
          return
        }

        const response = await fetch(textureUrl, { method: "HEAD" })
        setTextureExists(response.ok)
      } catch (error) {
        console.error("Error checking texture:", error)
        setTextureExists(false)
      }
    }

    checkTextureExists()
  }, [textureUrl])

  if (!textureExists) {
    return <div className={`w-full h-full flex items-center justify-center ${className || ""}`}>{fallbackContent}</div>
  }

  return (
    <div className={`w-full h-full ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        className="!bg-transparent"
      >
        <Scene>
          <HeadMesh textureUrl={textureUrl} />
        </Scene>
      </Canvas>
    </div>
  )
}

