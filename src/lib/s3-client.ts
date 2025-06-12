import { S3Client } from "@aws-sdk/client-s3";
export const S3 = new S3Client({
  region: "auto",
  endpoint: "https://7341f17eb0a6dab11d842eae33efac22.r2.cloudflarestorage.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: "26ab05bba2f659f4888e35ef0c9c9601",
    secretAccessKey:"00bce2334d7f3894399d94ad13bd6832fc4aeb1cc3d4b5762fb879dd1b970b26",
  },
});
