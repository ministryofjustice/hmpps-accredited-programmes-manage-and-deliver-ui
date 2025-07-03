import Type from './type'
import { kebabCaseToUpperCamelCase } from './utils'

export default class Component {
  constructor(
    private readonly directoryName: string,
    private readonly macroOptions: Array<Record<string, unknown>>,
  ) {}

  get definitions(): string {
    return `// The ${this.directoryName.replace(
      '-',
      ' ',
    )} component is described at https://design-system.service.gov.uk/components/${this.directoryName}.
${this.types.map(type => type.definition).join('\n')}`
  }

  private get types(): Array<Type> {
    return new Type(`GovukFrontend${this.upperCamelCaseComponentName}`, this.macroOptions).flattenedWithIntroducedTypes
  }

  private get upperCamelCaseComponentName(): string {
    return kebabCaseToUpperCamelCase(this.directoryName)
  }
}
