import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[EntryCheckTableToolbar]'
})
export class EntryCheckTableToolbarDirective {

  constructor(
      public templateRef: TemplateRef<any>,
      public viewContainer: ViewContainerRef
  ) { }

}
