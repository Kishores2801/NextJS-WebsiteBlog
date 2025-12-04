import { type SchemaTypeDefinition } from 'sanity'
import { skillType } from './skills'
import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {blogType} from './blogType'
import {authorType} from './authorType'
import { heroType } from './heroType'
import { projectType } from './projectType'
import { aboutType } from './aboutType'
import { careerType } from './careerType'
import certification from './certification'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, blogType, authorType, heroType, projectType, aboutType, careerType, skillType, certification, siteSettings],
}
