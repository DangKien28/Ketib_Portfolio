const fs = require('fs');
const path = require('path');
const dir = 'D:/DK_My_Code/Code_Web/Ketib_Portfolio/frontend/pages/admin';
for(const f of ['overview.html', 'my_projects.html', 'add_project.html', 'collab_management.html']) {
  let file = path.join(dir, f);
  let html = fs.readFileSync(file, 'utf8');
  let start = html.indexOf('<main');
  if(start > -1) {
    let contentStart = html.indexOf('>', start) + 1;
    let end = html.indexOf('</main>');
    if(end > -1) {
       fs.writeFileSync(file, html.substring(contentStart, end).trim());
    }
  }
}
