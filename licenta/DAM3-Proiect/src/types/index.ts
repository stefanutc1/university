export type ToolCategory = 'network' | 'scanner' | 'converters' | 'expenses' | 'hardware' | 'dev';
export interface ToolItem { id: string; name: string; description: string; category: ToolCategory; icon: string; route: string; tags: string[]; }
