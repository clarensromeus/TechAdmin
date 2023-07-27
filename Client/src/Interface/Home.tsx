interface IResponse {
  message: string;
  success: boolean;
}

interface IPost {
  formData: any;
  PostId: string;
  Title?: string;
  User?: any;
}

interface IUpload {
  formData: any;
}

export type { IResponse, IPost, IUpload };
