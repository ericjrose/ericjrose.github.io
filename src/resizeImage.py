from PIL import Image

for i in range(1,9):
    for j in range(1,4):
        OLD_PATH = r'../imgs/Large Images/ground_mountain' + str(j) + '_C' + str(i) + '.png'
        NEW_PATH = r'../imgs/ground_mountain' + str(j) + '_C' + str(i) + '.png'
        im = Image.open(OLD_PATH)
        pixels = im.load()
        width, height = im.size
        im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
        im.save(NEW_PATH)

        OLD_PATH = r'../imgs/Large Images/ground_hill' + str(j) + '_C' + str(i) + '.png'
        NEW_PATH = r'../imgs/ground_hill' + str(j) + '_C' + str(i) + '.png'
        im = Image.open(OLD_PATH)
        pixels = im.load()
        width, height = im.size
        im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
        im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_sun_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_sun_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_star_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_star_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/sky_moon_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/sky_moon_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_ball_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_ball_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_bush_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_bush_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)

    OLD_PATH = r'../imgs/Large Images/tree_triangle_C' + str(i) + '.png'
    NEW_PATH = r'../imgs/tree_triangle_C' + str(i) + '.png'
    im = Image.open(OLD_PATH)
    pixels = im.load()
    width, height = im.size
    im = im.resize((int(width*0.1), int(height*0.1)), Image.ANTIALIAS)
    im.save(NEW_PATH)
