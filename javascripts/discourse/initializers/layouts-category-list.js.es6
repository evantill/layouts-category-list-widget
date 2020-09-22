export default {
  name: 'layouts-category-list',
  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    const site = container.lookup('site:main');
    if (!siteSettings.layouts_enabled ||
        (site.mobileView && !siteSettings.layouts_mobile_enabled)) return;
        
    let layoutsError;
    let layouts;
    
    try {
      layouts = requirejs('discourse/plugins/discourse-layouts/discourse/lib/layouts');
    } catch(error) {
      layoutsError = error;
      console.error(layoutsError);
    }
    
    if (layoutsError) return;
    const parentCategories = [];
    const childCategories = {};
    const categories = site.categories || [];

    categories.forEach(function(c) {
      let parent = c.parentCategory;
      if (parent) {
        let siblings = childCategories[parent.slug] || []
        siblings.push(c);
        childCategories[parent.slug] = siblings;
      } else {
        parentCategories.push(c);
      }
    });
    
    const props = {
      parentCategories,
      childCategories
    }
    
    layouts.addSidebarProps(props);
  }
}
