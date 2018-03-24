describe('Test', () => {
  beforeEach(async () => {
    await device.launchApp({permissions: {photos: 'YES'}})
    // await device.reloadReactNative()
  })

  it('should show file upload', async () => {
    await expect(element(by.id('upload_status'))).toBeVisible()
    await expect(element(by.id('upload_status'))).toHaveText("Upload file")
    await expect(element(by.id('upload_file'))).toBeVisible()
    await element(by.id('upload_file')).tapAtPoint({x:50, y:20})
    await expect(element(by.id('photos'))).toBeVisible()
    await element(by.type('RCTImageView')).atIndex(0).tap()
    await expect(element(by.id('upload_status'))).toHaveText("File uploaded")
    await element(by.id('upload_file')).tapAtPoint({x:150, y:20})
  })
})
