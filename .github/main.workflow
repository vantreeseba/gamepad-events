workflow "New workflow" {
  on = "release"
  resolves = ["npm-publish"]
}

action "tag-filter" {
  uses = "actions/bin/filter@b2bea0749eed6beb495a8fa194c071847af60ea1"
  args = "tag"
}

action "npm-test" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["tag-filter"]
  args = "test"
}

action "npm-publish" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  needs = ["npm-test"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_SECRET"]
}
