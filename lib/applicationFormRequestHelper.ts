import { FieldTypes } from 'models/guilds';

export interface addFormFieldProps {
  sectionID: string;
  title: string;
  type: FieldTypes;
  description?: string;
  required?: boolean;
  nonce: string;
}

export interface requestData {
  route: string;
  body: any;
  method: 'PATCH';
}

// TODO: transform to a request bucket
export default class AFRH {
  BASE: string;
  requests: requestData[] = [];

  constructor(private __id__: string) {}

  getBase(base: string) {
    return (this.BASE = `${base}/api/v1/servers/${this.__id__}/applications/`);
  }

  get token(): string | null {
    try {
      return localStorage.getItem('@pup/token');
    } catch {
      return null;
    }
  }

  addFormField(
    base: string,
    { sectionID, description = '', title, type, required = false, nonce }: addFormFieldProps
  ) {
    const baseURL = this.BASE || this.getBase(base);
    this.requests.push({
      method: 'PATCH',
      body: {
        description,
        title,
        type,
        required,
        nonce,
      },
      route: `${baseURL}sections/${sectionID}/fields`,
    });
  }
}
