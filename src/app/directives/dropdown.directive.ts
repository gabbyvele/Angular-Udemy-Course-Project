import {Directive, ElementRef, HostBinding, HostListener, Renderer2} from "@angular/core";

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.show') isOpen: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click') toggleOpen() {
    // Get the <ul> element within the button group
    const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');

    // Toggle the 'show' class on the <ul> element
    if (dropdownMenu) {
      if (!this.isOpen) {
        this.renderer.addClass(dropdownMenu, 'show');
      } else {
        this.renderer.removeClass(dropdownMenu, 'show');
      }
      this.isOpen = !this.isOpen;
    }
  }
}
