import { NgModule } from '@angular/core';
import { TranslationPipe } from './translation/translation';
import { FiltercatandsubcatPipe } from './filtercatandsubcat/filtercatandsubcat';
@NgModule({
	declarations: [TranslationPipe,
    FiltercatandsubcatPipe],
	imports: [],
	exports: [TranslationPipe,
    FiltercatandsubcatPipe]
})
export class PipesModule {}
