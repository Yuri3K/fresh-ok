import { Component, Input } from '@angular/core';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-loader',
  imports: [
    LottieComponent
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  @Input() diameter = 126;
  // private lottiePath = 'assets/lottie/delivery_truck.json';
  // private lottiePath = 'assets/lottie/fast_food.json';
  // private lottiePath = 'assets/lottie/restaurant_food.json';
  private lottiePath = 'assets/lottie/shopping_cart.json';
  // private lottiePath = 'assets/lottie/shopping-cart.json';

  options: AnimationOptions = {
    path: this.lottiePath,
    autoplay: true,
    loop: true,
  };
}
