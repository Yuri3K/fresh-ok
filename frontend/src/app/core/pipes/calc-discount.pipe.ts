import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcDiscount'
})
export class CalcDiscountPipe implements PipeTransform {

  transform(price: number | string, discount: number | string): number {
    // Преобразуем в числа с плавающей точкой
    const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;
    const parsedDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;

    // Валидация входных данных
    if (isNaN(parsedPrice) || isNaN(parsedDiscount)) {
      console.warn('calcDiscount: Invalid input values', { price, discount });
      return 0;
    }

    if (parsedDiscount < 0 || parsedDiscount > 100) {
      console.warn('calcDiscount: Discount should be between 0 and 100', parsedDiscount);
      return parsedPrice;
    }

    // Вычисляем цену со скидкой
    // Например: 5.49 - (5.49 * 15 / 100) = 5.49 * 0.85 = 4.67
    const priceWithDiscount = parsedPrice * (1 - parsedDiscount / 100);

    // Округляем до 2 знаков после запятой
    return Math.round(priceWithDiscount * 100) / 100;
  }

}
