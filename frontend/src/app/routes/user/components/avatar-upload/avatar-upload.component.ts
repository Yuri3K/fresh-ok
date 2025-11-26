import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../../core/services/image.service';

@Component({
  selector: 'app-avatar-upload',
  imports: [
    CommonModule,

  ],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
  // (В реальном проекте стили и шаблон выносятся в отдельные файлы)
})
export class AvatarUploadComponent {
  selectedFile: File | null = null;
  isUploading: boolean = false;
  message: string = '';
  isError: boolean = false;
  uploadedUrl: string | null = null;

  constructor(
    private imageService: ImageService,
  ) { }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.message = '';
      this.uploadedUrl = null;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.message = 'Выберите файл для загрузки.';
      this.isError = true;
      return;
    }

    this.isUploading = true;
    this.message = 'Начало загрузки...';
    this.isError = false;
    this.uploadedUrl = null;

    this.imageService.uploadAvatar(this.selectedFile).subscribe({
      next: (response) => {
        this.message = 'Загрузка прошла успешно! ID: ' + response.public_id;
        this.uploadedUrl = response.url; // Публичный URL из ответа бэкенда
        this.isError = false;
        this.isUploading = false;
        this.selectedFile = null; // Очищаем выбранный файл
        
        // В продакшне здесь вы обновите данные пользователя в Angular-сервисе
        // и сгенерируете URL для отображения (с трансформацией)
      },
      error: (error) => {
        console.error('Ошибка загрузки:', error);
        this.message = 'Ошибка загрузки: ' + (error.error?.message || 'Неизвестная ошибка.');
        this.isError = true;
        this.isUploading = false;
      }
    });
  }
}
