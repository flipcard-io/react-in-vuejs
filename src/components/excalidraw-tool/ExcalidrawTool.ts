import type {
  API,
  BlockAPI,
  BlockTool,
  BlockToolConstructorOptions,
  ToolboxConfig
} from "@editorjs/editorjs";
import type {Logger} from "@/services/logging/Logger.ts";
import {container} from "@/services/DI/container.ts";
import {Types} from "@/services/DI/Types.ts";
import {generateId} from "@/utils";
import type {
  ExcaldrawToolData
} from "@/components/plugins/excalidraw-tool/model/ExcaldrawToolData.ts";
import type {
  ExcaldrawConfig
} from "@/components/plugins/excalidraw-tool/model/ExcaldrawConfig.ts";
import type {BlockToolData} from "@editorjs/editorjs/types/tools/block-tool-data";
import {
  createExcaldrawToolbox
} from "@/components/plugins/excalidraw-tool/index.ts";
import {cloneDeep} from "lodash";
import {type App, h, render} from "vue";
import ExcaldrawToolComponent
  from "@/components/plugins/excalidraw-tool/ExcaldrawToolComponent.vue";
import type {ExcalidrawInitialDataState} from "@excalidraw/excalidraw/types";
import type {
  ExcaldrawToolComponentProps
} from "@/components/plugins/excalidraw-tool/model/ExcaldrawToolComponentProps.ts";

type ExcalidrawToolConstructorOptions = BlockToolConstructorOptions<ExcaldrawToolData, ExcaldrawConfig>;

export default class ExcalidrawTool implements BlockTool {
  public readonly toolData: ExcaldrawToolData;
  private api: API;
  private readonly config: ExcaldrawConfig | undefined;
  private readonly readOnly: boolean;
  public readonly block: BlockAPI;
  private readonly logger: Logger
  private readonly uniqueClass: string = "excalidraw-tool-" + generateId()

  constructor({data, config, api, block, readOnly}: ExcalidrawToolConstructorOptions) {
    this.logger = container.get<Logger>(Types.Logger);

    if (data && Object.keys(data).length > 0) {
      this.toolData = cloneDeep(data)
    } else if (!!config && config.data) {
      this.toolData = cloneDeep(config.data)
    } else {
      this.logger.error("ExcalidrawTool toolData is not defined");
      throw "ExcalidrawTool toolData is not defined";
    }

    this.api = api;
    this.config = config;
    this.readOnly = readOnly;
    this.block = block;
  }

  static get toolbox(): ToolboxConfig {
    return createExcaldrawToolbox()
  }

  validate(blockData: BlockToolData): boolean {
    this.logger.debug("ExcalidrawTool validate")
    if (blockData && Object.keys(blockData).length > 0) {
      return true
    } else {
      this.logger.error("ExcalidrawTool toolData is not defined");
      return false
    }
  }

  render(): HTMLDivElement {
    const app = container.get<App>(Types.App);
    const vueComponent = h(ExcaldrawToolComponent, {
      ...this.getOrCreateProps(),
      onChanged: (data: ExcalidrawInitialDataState) => {
        this.toolData.data = data;
        this.block.dispatchChange()
      },
      onHeightChanged: (height: number) => {
        this.toolData.metadata = {
          ...this.toolData.metadata,
          height: height
        }
        this.block.dispatchChange()
      }
    })

    vueComponent.appContext = app._context;
    const htmlDivElement = document.createElement("div");
    htmlDivElement.classList.add(this.uniqueClass);
    // Add position relative and z-index to control stacking context
    // There was an issue where popup menu was showing behind the Excalidraw canvas
    htmlDivElement.style.position = 'relative';
    htmlDivElement.style.zIndex = '0';
    htmlDivElement.classList.add('my-3')
    render(vueComponent, htmlDivElement);
    this.logger.debug('Rendered');
    return htmlDivElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(block: HTMLElement): BlockToolData {
    return cloneDeep(this.toolData)
  }

  getOrCreateProps(): ExcaldrawToolComponentProps {
    return {
      data: this.toolData.data,
      height: this.toolData.metadata?.height ?? 650,
    } as ExcaldrawToolComponentProps
  }
}
