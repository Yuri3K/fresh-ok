import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export interface DeleteAvatarResponse {
  success: boolean,
  message: string,
  result?: any,
  error?: any
}

@Injectable({
  providedIn: 'root'
})
export class AvatarImageService {
  private apiService = inject(ApiService)
  private _avatarUrl = signal('')

  avatarUrl = this._avatarUrl.asReadonly()


  /**
   * Отправляет файл изображения на сервер для загрузки.
   * @param file Файл, выбранный пользователем (File)
   */
  uploadAvatar(file: File): Observable<any> {
    // FormData используется для отправки файлов (multipart/form-data)
    const formData = new FormData();

    // 'image' - это имя поля, которое ожидает Multer middleware (upload.single('image'))
    formData.append('image', file, file.name);

    return this.apiService.post('/avatar', formData)
  }

  uploadAvatarFromBlob(blob: Blob): Observable<any> {
    const file = new File([blob], 'avatar.png', { type: blob.type });

    const formData = new FormData();
    formData.append('image', file, file.name);

    return this.apiService.post('/avatar', formData);
  }

  setAvatarUrl(url: string) {
    this._avatarUrl.set(url)
  }

  deleteAvatar(): Observable<DeleteAvatarResponse | null> {
    if(!this._avatarUrl()) return of(null)

    const public_id = this._avatarUrl().split('/').slice(-1)[0]

    return this.apiService.delete<DeleteAvatarResponse>(`/avatar/remove/${public_id}`)

  }
}