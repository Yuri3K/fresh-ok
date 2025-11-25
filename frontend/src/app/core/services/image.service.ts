import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiService = inject(ApiService

  )

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
}