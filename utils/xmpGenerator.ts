
import { LightroomParams } from '../types';

export const generateXMP = (params: LightroomParams, presetName: string): string => {
  const { 
    exposure, contrast, highlights, shadows, whites, blacks, 
    temperature, tint, vibrance, saturation, clarity, dehaze, 
    texture, sharpness, noiseReduction, colorNoiseReduction, hsl, colorGrading 
  } = params;

  return `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c140 79.160451, 2017/09/14-10:25:28">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
   crs:PresetType="Normal"
   crs:Cluster=""
   crs:UUID="${Math.random().toString(36).substring(2, 15)}"
   crs:SupportsAmount="True"
   crs:SupportsColor="True"
   crs:SupportsMonochrome="True"
   crs:SupportsHighDynamicRange="True"
   crs:SupportsNormalDynamicRange="True"
   crs:SupportsSceneReferred="True"
   crs:SupportsOutputReferred="True"
   crs:CameraConfig="Camera Profile"
   crs:HasSettings="True"
   crs:Exposure2012="${exposure.toFixed(2)}"
   crs:Contrast2012="${Math.round(contrast)}"
   crs:Highlights2012="${Math.round(highlights)}"
   crs:Shadows2012="${Math.round(shadows)}"
   crs:Whites2012="${Math.round(whites)}"
   crs:Blacks2012="${Math.round(blacks)}"
   crs:Temperature="${Math.round(temperature)}"
   crs:Tint="${Math.round(tint)}"
   crs:Saturation="${Math.round(saturation)}"
   crs:Vibrance="${Math.round(vibrance)}"
   crs:Clarity2012="${Math.round(clarity)}"
   crs:Dehaze="${Math.round(dehaze)}"
   crs:Texture="${Math.round(texture)}"
   crs:Sharpness="${Math.round(sharpness)}"
   crs:LuminanceSmoothing="${Math.round(noiseReduction || 0)}"
   crs:ColorNoiseReduction="${Math.round(colorNoiseReduction || 0)}"
   crs:HueAdjustmentRed="${Math.round(hsl.red.hue)}"
   crs:HueAdjustmentOrange="${Math.round(hsl.orange.hue)}"
   crs:HueAdjustmentYellow="${Math.round(hsl.yellow.hue)}"
   crs:HueAdjustmentGreen="${Math.round(hsl.green.hue)}"
   crs:HueAdjustmentAqua="${Math.round(hsl.aqua.hue)}"
   crs:HueAdjustmentBlue="${Math.round(hsl.blue.hue)}"
   crs:HueAdjustmentPurple="${Math.round(hsl.purple.hue)}"
   crs:HueAdjustmentMagenta="${Math.round(hsl.magenta.hue)}"
   crs:SaturationAdjustmentRed="${Math.round(hsl.red.sat)}"
   crs:SaturationAdjustmentOrange="${Math.round(hsl.orange.sat)}"
   crs:SaturationAdjustmentYellow="${Math.round(hsl.yellow.sat)}"
   crs:SaturationAdjustmentGreen="${Math.round(hsl.green.sat)}"
   crs:SaturationAdjustmentAqua="${Math.round(hsl.aqua.sat)}"
   crs:SaturationAdjustmentBlue="${Math.round(hsl.blue.sat)}"
   crs:SaturationAdjustmentPurple="${Math.round(hsl.purple.sat)}"
   crs:SaturationAdjustmentMagenta="${Math.round(hsl.magenta.sat)}"
   crs:LuminanceAdjustmentRed="${Math.round(hsl.red.lum)}"
   crs:LuminanceAdjustmentOrange="${Math.round(hsl.orange.lum)}"
   crs:LuminanceAdjustmentYellow="${Math.round(hsl.yellow.lum)}"
   crs:LuminanceAdjustmentGreen="${Math.round(hsl.green.lum)}"
   crs:LuminanceAdjustmentAqua="${Math.round(hsl.aqua.lum)}"
   crs:LuminanceAdjustmentBlue="${Math.round(hsl.blue.lum)}"
   crs:LuminanceAdjustmentPurple="${Math.round(hsl.purple.lum)}"
   crs:LuminanceAdjustmentMagenta="${Math.round(hsl.magenta.lum)}"
   crs:ColorGradeHighlightHue="${Math.round(colorGrading.highlights.hue)}"
   crs:ColorGradeHighlightSat="${Math.round(colorGrading.highlights.sat)}"
   crs:ColorGradeHighlightLum="${Math.round(colorGrading.highlights.lum)}"
   crs:ColorGradeMidtoneHue="${Math.round(colorGrading.midtones.hue)}"
   crs:ColorGradeMidtoneSat="${Math.round(colorGrading.midtones.sat)}"
   crs:ColorGradeMidtoneLum="${Math.round(colorGrading.midtones.lum)}"
   crs:ColorGradeShadowHue="${Math.round(colorGrading.shadows.hue)}"
   crs:ColorGradeShadowSat="${Math.round(colorGrading.shadows.sat)}"
   crs:ColorGradeShadowLum="${Math.round(colorGrading.shadows.lum)}"
   crs:ColorGradeBlending="${Math.round(colorGrading.blending)}"
   crs:ColorGradeBalance="${Math.round(colorGrading.balance)}"
   crs:HasCrop="False"
   crs:AlreadyApplied="True">
   <crs:Name>
    <rdf:Alt>
     <rdf:li xml:lang="x-default">${presetName}</rdf:li>
    </rdf:Alt>
   </crs:Name>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`;
};
