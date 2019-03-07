export class Scale {
  public static buildEmpty() {
    const build = new Scale();
    build.ratio = 0;
    build.height = 0;
    build.width = 0;
    build.originalHeight = 0;
    build.originalWidth = 0;
    return build;
  }
  public ratio: number;
  public originalWidth: number;
  public originalHeight: number;
  public width: number;
  public height: number;
}
