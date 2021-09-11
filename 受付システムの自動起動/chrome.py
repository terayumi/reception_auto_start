import chromedriver_binary # nopa
import time
from selenium import webdriver

# WebDriver のオプションを設定する
options = webdriver.ChromeOptions()
options.add_experimental_option("excludeSwitches",['enable-automation'])
#options.add_argument('--headless')

print('connectiong to remote browser...')
driver = webdriver.Chrome(options=options)


driver.get('http://localhost:8000/monitor')
print(driver.current_url)

driver.set_page_load_timeout(30)

driver.set_window_position(3000,200)


driver.find_element_by_id('fullscreen').click()


# ブラウザを終了する
#driver.quit()