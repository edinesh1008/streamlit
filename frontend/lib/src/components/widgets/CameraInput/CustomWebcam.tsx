/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, forwardRef } from "react"
import { FacingMode } from "./SwitchFacingModeButton"

interface CustomWebcamProps {
  width: number
  height: number
  screenshotFormat: string
  screenshotQuality: number
  facingMode: FacingMode
  style?: React.CSSProperties
  onUserMediaError: () => void
  onUserMedia: () => void
}

const CustomWebcam = forwardRef<HTMLVideoElement, CustomWebcamProps>(
  (
    { width, height, style, facingMode, onUserMediaError, onUserMedia },
    ref
  ) => {
    useEffect(() => {
      // Function to initialize camera
      const setupCamera = async (): Promise<void> => {
        try {
          if (!ref || typeof ref === "function" || !ref.current) {
            return
          }

          const videoElement = ref.current
          const constraints = {
            video: {
              width: { ideal: width },
              facingMode,
            },
            audio: false,
          }

          // Get user media
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            constraints
          )

          // Set the stream to the video element
          videoElement.srcObject = mediaStream

          // Call onUserMedia when the video can play
          videoElement.onloadedmetadata = () => {
            videoElement
              .play()
              .then(() => {
                onUserMedia()
              })
              .catch(() => {
                onUserMediaError()
              })
          }
        } catch (error) {
          onUserMediaError()
        }
      }

      setupCamera()

      // Cleanup function to stop the stream when component unmounts
      return () => {
        if (!ref || typeof ref === "function" || !ref.current) {
          return
        }

        const videoElement = ref.current
        const mediaStream = videoElement.srcObject as MediaStream | null

        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
        }
      }
    }, [width, facingMode, onUserMediaError, onUserMedia, ref])

    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        width={width}
        height={height}
        style={style}
        data-testid="stCustomWebcam"
      />
    )
  }
)

CustomWebcam.displayName = "CustomWebcam"

// Method to capture a screenshot from the video element
export const getScreenshot = (
  videoElement: HTMLVideoElement | null,
  screenshotFormat = "image/jpeg",
  screenshotQuality = 0.92
): string | null => {
  if (!videoElement) {
    return null
  }

  const canvas = document.createElement("canvas")
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    return null
  }

  // Draw the current video frame to the canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

  // Convert canvas to data URL
  return canvas.toDataURL(screenshotFormat, screenshotQuality)
}

export default CustomWebcam
