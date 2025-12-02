export interface UploadedFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'pdf';
  base64: string;
  mimeType: string;
}

export interface ProblemSetInfo {
  startNumber: string;
  endNumber: string;
}

export interface GenerationRequest {
  problemText: string;
  problemFiles: UploadedFile[];
  solutionText: string;
  solutionFiles: UploadedFile[];
  problemSet: ProblemSetInfo;
}
