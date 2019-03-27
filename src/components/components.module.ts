import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoadingModalComponent } from './loading-modal/loading-modal';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';
@NgModule({ 
	declarations: [LoadingModalComponent,
    ShrinkingSegmentHeaderComponent],
	imports: [],
	exports: [LoadingModalComponent,
	ShrinkingSegmentHeaderComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
